#
#  auto_md.rb
#  notes
#
#  Created by mervin on 2018-01-19.
#  Copyright 2018 mervin. All rights reserved.
#
# auto touch .md from specified file or _sidebar.md
require 'fileutils'

def create_file(filepath, headline)
  dir = File.split(filepath)[0]
  FileUtils.mkdir_p dir unless File.exist? dir
  f = File.new(filepath, 'w')
  f.write "# #{headline}"
  f.close
  puts "new file create at '#{filepath}'."
end

def regexp_fileline(fileline)
  /\[(.*)\]\((.+)(?=\))/ =~ fileline
  filepath = Regexp.last_match(2)
  headline = Regexp.last_match(1)
  [filepath, headline]
end

def run(filename)
  f = File.open filename
  f.readlines.each do |line|
    file_path, headline = regexp_fileline line
    create_file file_path, headline if file_path  \
      && File.extname(file_path) == '.md' \
      && !File.exist?(file_path)
  end
  f.close
rescue StandardError => ex
  puts ex.message
end

file = ARGV[0] ? ARGV[0] : '_sidebar.md'
puts "auto create files from #{file}"
run file
